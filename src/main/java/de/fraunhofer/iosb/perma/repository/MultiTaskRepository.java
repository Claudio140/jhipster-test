package de.fraunhofer.iosb.perma.repository;

import de.fraunhofer.iosb.perma.domain.MultiTask;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the MultiTask entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MultiTaskRepository extends JpaRepository<MultiTask, Long> {

}
