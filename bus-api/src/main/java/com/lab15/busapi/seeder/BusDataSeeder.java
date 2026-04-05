package com.lab15.busapi.seeder;

import com.lab15.busapi.model.Bus;
import com.lab15.busapi.repository.BusRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class BusDataSeeder implements CommandLineRunner {

    private final BusRepository busRepository;

    @Override
    public void run(String... args) {
        if (busRepository.count() == 0) {
            log.info("Seeding bus data...");
            busRepository.saveAll(List.of(
                Bus.builder().numeroBus("001").placa("ABC-123").caracteristicas("Aire acondicionado, 50 asientos, WiFi").marca("Volvo").activo(true).build(),
                Bus.builder().numeroBus("002").placa("DEF-456").caracteristicas("Sin aire acondicionado, 45 asientos").marca("Scania").activo(true).build(),
                Bus.builder().numeroBus("003").placa("GHI-789").caracteristicas("Aire acondicionado, 40 asientos, USB").marca("Fiat").activo(false).build(),
                Bus.builder().numeroBus("004").placa("JKL-012").caracteristicas("Doble piso, 80 asientos, WiFi, aire").marca("Volvo").activo(true).build(),
                Bus.builder().numeroBus("005").placa("MNO-345").caracteristicas("Minibus, 20 asientos").marca("Mercedes").activo(true).build(),
                Bus.builder().numeroBus("006").placa("PQR-678").caracteristicas("Aire acondicionado, 50 asientos").marca("Scania").activo(true).build(),
                Bus.builder().numeroBus("007").placa("STU-901").caracteristicas("45 asientos, GPS").marca("Yutong").activo(false).build(),
                Bus.builder().numeroBus("008").placa("VWX-234").caracteristicas("Aire acondicionado, 48 asientos, reclinables").marca("Volvo").activo(true).build(),
                Bus.builder().numeroBus("009").placa("YZA-567").caracteristicas("35 asientos, económico").marca("Fiat").activo(true).build(),
                Bus.builder().numeroBus("010").placa("BCD-890").caracteristicas("Aire acondicionado, 55 asientos, pantalla").marca("Scania").activo(true).build(),
                Bus.builder().numeroBus("011").placa("EFG-123").caracteristicas("Acceso discapacitados, 40 asientos").marca("Mercedes").activo(true).build(),
                Bus.builder().numeroBus("012").placa("HIJ-456").caracteristicas("50 asientos, WiFi, USB, aire").marca("Yutong").activo(false).build()
            ));
            log.info("Bus data seeded successfully ({} records)", busRepository.count());
        } else {
            log.info("Bus data already present, skipping seed.");
        }
    }
}
