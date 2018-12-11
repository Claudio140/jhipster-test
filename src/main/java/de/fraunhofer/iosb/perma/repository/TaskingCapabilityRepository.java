package de.fraunhofer.iosb.perma.repository;

import de.fraunhofer.iosb.perma.domain.TaskingCapability;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the TaskingCapability entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TaskingCapabilityRepository extends JpaRepository<TaskingCapability, Long> {

}
