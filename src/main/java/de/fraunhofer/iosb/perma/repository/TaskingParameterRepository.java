package de.fraunhofer.iosb.perma.repository;

import de.fraunhofer.iosb.perma.domain.TaskingParameter;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the TaskingParameter entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TaskingParameterRepository extends JpaRepository<TaskingParameter, Long> {

}
