package com.lab15.busapi.service;

import com.lab15.busapi.dto.BusDto;
import com.lab15.busapi.dto.PagedResponse;
import com.lab15.busapi.exception.ResourceNotFoundException;
import com.lab15.busapi.model.Bus;
import com.lab15.busapi.repository.BusRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BusServiceTest {

    @Mock
    private BusRepository busRepository;

    @InjectMocks
    private BusService busService;

    private Bus bus1;
    private Bus bus2;

    @BeforeEach
    void setUp() {
        bus1 = Bus.builder().id(1L).numeroBus("001").placa("ABC-123")
                .caracteristicas("WiFi, A/C").marca("Volvo").activo(true).build();
        bus2 = Bus.builder().id(2L).numeroBus("002").placa("DEF-456")
                .caracteristicas("45 asientos").marca("Scania").activo(false).build();
    }

    @Test
    void getAllBuses_returnsPagedResponse() {
        var page = new PageImpl<>(List.of(bus1, bus2), PageRequest.of(0, 10), 2);
        when(busRepository.findAll(any(PageRequest.class))).thenReturn(page);

        PagedResponse<BusDto> result = busService.getAllBuses(0, 10);

        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getTotalElements()).isEqualTo(2);
        assertThat(result.getPage()).isZero();
        assertThat(result.getSize()).isEqualTo(10);
        assertThat(result.isLast()).isTrue();
    }

    @Test
    void getAllBuses_mapsFieldsCorrectly() {
        var page = new PageImpl<>(List.of(bus1), PageRequest.of(0, 10), 1);
        when(busRepository.findAll(any(PageRequest.class))).thenReturn(page);

        PagedResponse<BusDto> result = busService.getAllBuses(0, 10);
        BusDto dto = result.getContent().get(0);

        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getNumeroBus()).isEqualTo("001");
        assertThat(dto.getPlaca()).isEqualTo("ABC-123");
        assertThat(dto.getMarca()).isEqualTo("Volvo");
        assertThat(dto.isActivo()).isTrue();
    }

    @Test
    void getBusById_returnsDto_whenExists() {
        when(busRepository.findById(1L)).thenReturn(Optional.of(bus1));

        BusDto result = busService.getBusById(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getPlaca()).isEqualTo("ABC-123");
    }

    @Test
    void getBusById_throwsNotFound_whenMissing() {
        when(busRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> busService.getBusById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }
}
