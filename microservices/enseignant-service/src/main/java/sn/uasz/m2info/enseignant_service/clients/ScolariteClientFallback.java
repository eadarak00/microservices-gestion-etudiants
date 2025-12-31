package sn.uasz.m2info.enseignant_service.clients;

import org.springframework.stereotype.Component;
import sn.uasz.m2info.enseignant_service.dtos.ClasseDto;
import sn.uasz.m2info.enseignant_service.dtos.MatiereDto;
import sn.uasz.m2info.enseignant_service.exceptions.ServiceUnavailableException;

@Component
public class ScolariteClientFallback implements ScolariteClient {
    
    @Override
    public ClasseDto getClasse(Long id) {
        // Fallback
        throw new ServiceUnavailableException("ScolariteService is unavailable");
    }

    @Override
    public MatiereDto getMatiere(Long id) {
        // Fallback
        throw new ServiceUnavailableException("ScolariteService is unavailable");
    }
}
