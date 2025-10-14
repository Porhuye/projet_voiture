package com.example.cars.dto;

import com.example.cars.Voiture;
import com.example.cars.VoitureRepository;
import com.example.cars.dto.VoitureRequest;
import com.example.cars.dto.VoitureResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class VoitureService {

    private final VoitureRepository repo;

    public VoitureService(VoitureRepository repo) {
        this.repo = repo;
    }

    public VoitureResponse create(VoitureRequest req) {
        if (repo.existsByImmatriculation(req.immatriculation())) {
            throw new IllegalArgumentException("Immatriculation déjà utilisée");
        }
        Voiture v = new Voiture(null, req.carName(), req.couleur(), req.immatriculation(), req.carType());
        return toResponse(repo.save(v));
    }

    @Transactional(readOnly = true)
    public List<VoitureResponse> getAll() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public VoitureResponse getById(Long id) {
        return repo.findById(id).map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Voiture introuvable: " + id));
    }

    public VoitureResponse update(Long id, VoitureRequest req) {
        Voiture v = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Voiture introuvable: " + id));
        v.setCarName(req.carName());
        v.setCouleur(req.couleur());
        v.setImmatriculation(req.immatriculation());
        v.setCarType(req.carType());
        return toResponse(v); // entité managée, flush par JPA
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    private VoitureResponse toResponse(Voiture v) {
        return new VoitureResponse(v.getId(), v.getCarName(), v.getCouleur(),
                v.getImmatriculation(), v.getCarType());
    }
}
