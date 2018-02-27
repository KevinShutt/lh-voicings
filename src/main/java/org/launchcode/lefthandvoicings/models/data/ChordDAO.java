package org.launchcode.lefthandvoicings.models.data;

import org.launchcode.lefthandvoicings.models.Chord;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
@Transactional
public interface ChordDAO extends CrudRepository<Chord, Integer>{
}
