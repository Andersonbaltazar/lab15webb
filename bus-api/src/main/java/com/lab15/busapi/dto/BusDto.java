package com.lab15.busapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusDto {
    private Long id;
    private String numeroBus;
    private String placa;
    private LocalDateTime fechaCreacion;
    private String caracteristicas;
    private String marca;
    private boolean activo;
}
