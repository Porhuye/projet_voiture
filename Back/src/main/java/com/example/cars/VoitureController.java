package com.example.cars;

import com.example.cars.dto.VoitureRequest;
import com.example.cars.dto.VoitureResponse;
import com.example.cars.dto.VoitureService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/voitures")
public class VoitureController {

    private final VoitureService service;

    public VoitureController(VoitureService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VoitureResponse create(@Valid @RequestBody VoitureRequest body) {
        return service.create(body); // <— objet JSON complet reçu
    }

    @GetMapping
    public List<VoitureResponse> list() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public VoitureResponse get(@PathVariable Long id) {
        return service.getById(id); // <— récupéré depuis la BDD (objet “chargé”)
    }

    @PutMapping("/{id}")
    public VoitureResponse update(@PathVariable Long id, @Valid @RequestBody VoitureRequest body) {
        return service.update(id, body);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
