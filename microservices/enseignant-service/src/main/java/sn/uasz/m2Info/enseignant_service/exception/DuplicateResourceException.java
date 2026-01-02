package sn.uasz.m2Info.enseignant_service.exception;

/**
 * Exception levée quand on tente de créer une ressource avec des données en doublon
 * Retournera un code HTTP 409 Conflict
 */
public class DuplicateResourceException extends RuntimeException {

    /**
     * Constructeur avec message uniquement
     * 
     * @param message Message décrivant le doublon
     */
    public DuplicateResourceException(String message) {
        super(message);
    }

    /**
     * Constructeur avec message et cause
     * 
     * @param message Message décrivant le doublon
     * @param cause Exception originale
     */
    public DuplicateResourceException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * Constructeur de convenance pour les doublons de champ
     * 
     * @param resourceName Nom de la ressource (ex: "Enseignant")
     * @param fieldName Nom du champ en doublon (ex: "matricule")
     * @param fieldValue Valeur en doublon (ex: "ENS001")
     */
    public DuplicateResourceException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s existe déjà avec %s : '%s'", resourceName, fieldName, fieldValue));
    }
}