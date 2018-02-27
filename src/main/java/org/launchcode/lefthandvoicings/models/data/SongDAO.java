package org.launchcode.lefthandvoicings.models.data;

import org.launchcode.lefthandvoicings.models.Song;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
@Transactional
public interface SongDAO extends CrudRepository<Song, Integer> {
}
