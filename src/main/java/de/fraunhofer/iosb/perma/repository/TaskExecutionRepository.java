package de.fraunhofer.iosb.perma.repository;

import de.fraunhofer.iosb.perma.domain.TaskExecution;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the TaskExecution entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TaskExecutionRepository extends JpaRepository<TaskExecution, Long> {

}
