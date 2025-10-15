package com.example.cars;

import com.example.cars.dto.VoitureRequest;
import com.example.cars.dto.VoitureResponse;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

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
            // 409 si conflit d'unicité
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Immatriculation déjà utilisée");
        }
        Voiture v = new Voiture(
                null,
                req.carName(),
                req.couleur(),
                req.immatriculation(),
                req.carType()
        );
        return toResponse(repo.save(v));
    }

    @Transactional(readOnly = true)
    public List<VoitureResponse> getAll() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public VoitureResponse getById(Long id) {
        // 404 si non trouvé
        return repo.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Voiture introuvable: " + id));
    }

    public VoitureResponse update(Long id, VoitureRequest req) {
        // 404 si non trouvé
        Voiture v = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Voiture introuvable: " + id));

        v.setCarName(req.carName());
        v.setCouleur(req.couleur());
        v.setImmatriculation(req.immatriculation());
        v.setCarType(req.carType());
        // entité managée => flush automatique en fin de transaction
        return toResponse(v);
    }

    public void delete(Long id) {
        try {
            repo.deleteById(id);
        } catch (EmptyResultDataAccessException e) {
            // 404 si on tente de supprimer un id inexistant
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Voiture introuvable: " + id);
        }
    }

    private VoitureResponse toResponse(Voiture v) {
        return new VoitureResponse(
                v.getId(),
                v.getCarName(),
                v.getCouleur(),
                v.getImmatriculation(),
                v.getCarType()
        );
    }
}
