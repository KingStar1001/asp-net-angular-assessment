using event_system.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace event_system.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AllergyController : ControllerBase
    {
        private readonly EventSystemContext _dbContext;

        public AllergyController(EventSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        // GET: api/Allergy
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Allergy>>> GetAllergies()
        {
            if (_dbContext.Allergies == null)
            {
                return NotFound();
            }
            return await _dbContext.Allergies.ToListAsync();
        }

        // GET: api/Allergy/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Allergy>> GetAllergy(int id)
        {
            if (_dbContext.Allergies == null)
            {
                return NotFound();
            }
            var allergy = await _dbContext.Allergies.FindAsync(id);

            if (allergy == null)
            {
                return NotFound();
            }

            return allergy;
        }

        // POST: api/Allergy
        [HttpPost]
        public async Task<ActionResult<Allergy>> PostAllergy(Allergy allergy)
        {
            _dbContext.Allergies.Add(allergy);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllergy), new { id = allergy.ID }, allergy);
        }

        // PUT: api/Allergy/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAllergy(int id, Allergy allergy)
        {
            if (id != allergy.ID)
            {
                return BadRequest();
            }

            _dbContext.Entry(allergy).State = EntityState.Modified;

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AllergyExists(id))
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

        // DELETE: api/Allergy/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAllergy(int id)
        {
            if (_dbContext.Allergies == null)
            {
                return NotFound();
            }

            var allergy = await _dbContext.Allergies.FindAsync(id);
            if (allergy == null)
            {
                return NotFound();
            }

            _dbContext.Allergies.Remove(allergy);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        private bool AllergyExists(long id)
        {
            return (_dbContext.Allergies?.Any(e => e.ID == id)).GetValueOrDefault();
        }
    }
}
