package com.lab15.busapi.controller;

import com.lab15.busapi.dto.BusDto;
import com.lab15.busapi.dto.PagedResponse;
import com.lab15.busapi.exception.ResourceNotFoundException;
import com.lab15.busapi.security.ApiKeyFilter;
import com.lab15.busapi.service.BusService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BusController.class)
@Import({ApiKeyFilter.class, com.lab15.busapi.config.SecurityConfig.class})
class BusControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BusService busService;

    private static final String VALID_API_KEY = "test-api-key";

    @Test
    void getAllBuses_withValidKey_returns200() throws Exception {
        PagedResponse<BusDto> response = PagedResponse.<BusDto>builder()
                .content(List.of(
                        BusDto.builder().id(1L).numeroBus("001").placa("ABC-123").marca("Volvo").activo(true).build()
                ))
                .page(0).size(10).totalElements(1).totalPages(1).last(true)
                .build();

        when(busService.getAllBuses(0, 10)).thenReturn(response);

        mockMvc.perform(get("/bus")
                        .header("X-API-KEY", VALID_API_KEY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].numeroBus").value("001"))
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.page").value(0));
    }

    @Test
    void getAllBuses_withoutApiKey_returns401() throws Exception {
        mockMvc.perform(get("/bus"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getAllBuses_withWrongKey_returns401() throws Exception {
        mockMvc.perform(get("/bus")
                        .header("X-API-KEY", "wrong-key"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getBusById_withValidKey_returns200() throws Exception {
        BusDto dto = BusDto.builder().id(1L).numeroBus("001").placa("ABC-123").marca("Volvo").activo(true).build();
        when(busService.getBusById(1L)).thenReturn(dto);

        mockMvc.perform(get("/bus/1")
                        .header("X-API-KEY", VALID_API_KEY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.placa").value("ABC-123"));
    }

    @Test
    void getBusById_withValidKey_returns404_whenNotFound() throws Exception {
        when(busService.getBusById(99L)).thenThrow(new ResourceNotFoundException("Bus no encontrado con id: 99"));

        mockMvc.perform(get("/bus/99")
                        .header("X-API-KEY", VALID_API_KEY))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Bus no encontrado con id: 99"));
    }
}
