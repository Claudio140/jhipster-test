package de.fraunhofer.iosb.perma.repository;

import de.fraunhofer.iosb.perma.domain.Actor;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Actor entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ActorRepository extends JpaRepository<Actor, Long> {

}
