package com.lab15.busapi.service;

import com.lab15.busapi.dto.BusDto;
import com.lab15.busapi.dto.PagedResponse;
import com.lab15.busapi.exception.ResourceNotFoundException;
import com.lab15.busapi.model.Bus;
import com.lab15.busapi.repository.BusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BusService {

    private final BusRepository busRepository;

    public PagedResponse<BusDto> getAllBuses(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Bus> busPage = busRepository.findAll(pageable);

        return PagedResponse.<BusDto>builder()
                .content(busPage.getContent().stream().map(this::toDto).toList())
                .page(busPage.getNumber())
                .size(busPage.getSize())
                .totalElements(busPage.getTotalElements())
                .totalPages(busPage.getTotalPages())
                .last(busPage.isLast())
                .build();
    }

    public BusDto getBusById(Long id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus no encontrado con id: " + id));
        return toDto(bus);
    }

    private BusDto toDto(Bus bus) {
        return BusDto.builder()
                .id(bus.getId())
                .numeroBus(bus.getNumeroBus())
                .placa(bus.getPlaca())
                .fechaCreacion(bus.getFechaCreacion())
                .caracteristicas(bus.getCaracteristicas())
                .marca(bus.getMarca())
                .activo(bus.isActivo())
                .build();
    }
}
