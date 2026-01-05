package sn.uasz.m2info.scolarite_service.services;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sn.uasz.m2info.scolarite_service.dtos.ClasseMatiereDTO;
import sn.uasz.m2info.scolarite_service.dtos.MatiereResponseDto;
import sn.uasz.m2info.scolarite_service.entities.Classe;
import sn.uasz.m2info.scolarite_service.entities.ClasseMatiere;
import sn.uasz.m2info.scolarite_service.entities.Matiere;
import sn.uasz.m2info.scolarite_service.repositories.ClasseMatiereRepository;
import sn.uasz.m2info.scolarite_service.repositories.ClasseRepository;
import sn.uasz.m2info.scolarite_service.repositories.MatiereRepository;

@Service
@RequiredArgsConstructor
public class ClasseMatiereService {

    private final ClasseMatiereRepository repo;
    private final ClasseRepository classeRepo;
    private final MatiereRepository matiereRepo;

    public ClasseMatiere affecter(Long classeId, Long matiereId, Integer vh) {

        Classe c = classeRepo.findById(classeId)
                .orElseThrow(() -> new RuntimeException("Classe introuvable"));

        Matiere m = matiereRepo.findById(matiereId)
                .orElseThrow(() -> new RuntimeException("Matière introuvable"));

        ClasseMatiere cm = new ClasseMatiere();
        cm.setClasse(c);
        cm.setMatiere(m);
        cm.setVolumeHoraire(vh);

        return repo.save(cm);
    }

    public List<ClasseMatiereDTO> matieresParClasse(Long classeId) {

    // Vérifier l'existence de la classe
    if (!classeRepo.existsById(classeId)) {
        throw new RuntimeException("Classe introuvable");
    }

    return repo.findByClasseId(classeId)
            .stream()
            .map(cm -> new ClasseMatiereDTO(
                    cm.getMatiere().getId(),
                    cm.getMatiere().getCode(),
                    cm.getMatiere().getLibelle(),
                    cm.getMatiere().getCoefficient(),
                    cm.getVolumeHoraire()
            ))
            .toList(); // retourne [] si vide
}

}
