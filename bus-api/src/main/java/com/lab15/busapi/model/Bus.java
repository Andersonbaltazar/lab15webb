package com.lab15.busapi.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "bus")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_bus", nullable = false)
    private String numeroBus;

    @Column(name = "placa", nullable = false, unique = true, length = 20)
    private String placa;

    @CreationTimestamp
    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "caracteristicas", columnDefinition = "TEXT")
    private String caracteristicas;

    @Column(name = "marca", length = 50)
    private String marca;

    @Column(name = "activo", nullable = false)
    private boolean activo;
}
