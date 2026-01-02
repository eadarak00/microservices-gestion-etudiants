package sn.uasz.m2Info.enseignant_service.exception;

/**
 * Exception levée quand une ressource demandée n'existe pas
 * Retournera un code HTTP 404 Not Found
 */
public class ResourceNotFoundException extends RuntimeException {

    /**
     * Constructeur avec message uniquement
     * 
     * @param message Message décrivant la ressource non trouvée
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }

    /**
     * Constructeur avec message et cause
     * 
     * @param message Message décrivant la ressource non trouvée
     * @param cause Exception originale
     */
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * Constructeur de convenance pour les ressources par ID
     * 
     * @param resourceName Nom de la ressource (ex: "Enseignant")
     * @param fieldName Nom du champ (ex: "id")
     * @param fieldValue Valeur du champ (ex: 123)
     */
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s non trouvé(e) avec %s : '%s'", resourceName, fieldName, fieldValue));
    }
}