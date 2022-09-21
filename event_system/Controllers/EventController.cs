using event_system.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using event_system.Dao;

namespace event_system.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : Controller
    {
        private readonly EventSystemContext _dbContext;

        public EventController(EventSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        // GET: api/Event
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
        {
            if (_dbContext.Events == null)
            {
                return NotFound();
            }
            return await _dbContext.Events.Include(x=>x.Guests).ToListAsync();
        }

        // GET: api/Event/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetEvent(int id)
        {
            if (_dbContext.Events == null)
            {
                return NotFound();
            }
            var _event = await _dbContext.Events.Where(x => x.ID == id).Include(x => x.Guests).FirstOrDefaultAsync();

            if (_event == null)
            {
                return NotFound();
            }

            return _event;
        }

        // POST: api/Event
        [HttpPost]
        public async Task<ActionResult<Event>> PostEvent(EventDao _eventdao)
        {
            if (_eventdao.ID > 0 || _eventdao.Guests.Count < 2) return BadRequest();
            Event element = new Event();
            element.clone(_eventdao);
            _dbContext.Events.Add(element);
            await AddEvents(element, _eventdao.Guests);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEvent), new { id = _eventdao.ID }, _eventdao);
        }

        // PUT: api/Event/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEvent(int id, EventDao _eventDao)
        {
            if (id != _eventDao.ID || _eventDao.ID <= 0 || _eventDao.Guests.Count < 2)
            {
                return BadRequest();
            }

            try
            {
                var activeEvent = await _dbContext.Events.Where(x => x.ID == id)
                            .Include(x => x.Guests).FirstOrDefaultAsync();

                activeEvent?.clone(_eventDao);

                await AddEvents(activeEvent!, _eventDao.Guests);
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Event/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            if (_dbContext.Events == null)
            {
                return NotFound();
            }

            var _event = await _dbContext.Events.FindAsync(id);
            if (_event == null)
            {
                return NotFound();
            }

            _dbContext.Events.Remove(_event);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        private bool EventExists(long id)
        {
            return (_dbContext.Events?.Any(e => e.ID == id)).GetValueOrDefault();
        }

        private async Task<bool> AddEvents(Event _event, IList<int> _guests)
        {
            int index = 0;
            while (index < _event.Guests.Count)
            {
                var currentGuest = _event.Guests.ElementAt(index);
                var _guestId = _guests.Where(x => x == currentGuest.ID).FirstOrDefault();
                if (_guestId == 0)
                    _event.Guests.Remove(currentGuest);
                else
                {
                    _guests.Remove(_guestId);
                    index++;
                }
            }
            foreach (int guestId in _guests)
            {
                if (_event.Guests.Where(x => x.ID == guestId).Count() > 0) continue;
                Guest? guest = await _dbContext.Guests.Where(x => x.ID == guestId).FirstOrDefaultAsync();
                _event.Guests.Add(guest!);
            }
            return true;
        }
    }
}
