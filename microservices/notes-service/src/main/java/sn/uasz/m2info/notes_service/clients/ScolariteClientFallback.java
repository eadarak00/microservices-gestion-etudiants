package sn.uasz.m2info.notes_service.clients;

import java.util.List;

import org.springframework.stereotype.Component;
import sn.uasz.m2info.notes_service.dtos.ClasseDto;
import sn.uasz.m2info.notes_service.dtos.EtudiantDto;
import sn.uasz.m2info.notes_service.dtos.MatiereDto;
import sn.uasz.m2info.notes_service.exceptions.ServiceUnavailableException;

@Component
public class ScolariteClientFallback implements ScolariteClient {

    @Override
    public ClasseDto getClasse(Long id) {
        // Fallback
        throw new ServiceUnavailableException("ScolariteService is unavailable");
    }

    @Override
    public List<EtudiantDto> getEtudiantsByClasse(Long classeId) {
        // Fallback
        throw new ServiceUnavailableException("ScolariteService is unavailable");
    }

    @Override
    public MatiereDto getMatiere(Long id) {
        // Fallback
        throw new ServiceUnavailableException("ScolariteService is unavailable");
    }
}
