using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SIMIKO.App.Server.Data;
using SIMIKO.App.Server.Models;

namespace SIMIKO.App.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PeriodeController : ControllerBase
    {
        private readonly CaringDBContext _context;

        public PeriodeController(CaringDBContext context)
        {
            _context = context;
        }

        // GET: api/Periode
        [HttpGet]
        public async Task<ActionResult<IEnumerable<tblPeriode>>> GettblPeriode()
        {
            return await _context.tblPeriode.ToListAsync();
        }

        // GET: api/Periode/5
        [HttpGet("{id}")]
        public async Task<ActionResult<tblPeriode>> GettblPeriode(int id)
        {
            var tblPeriode = await _context.tblPeriode.FindAsync(id);

            if (tblPeriode == null)
            {
                return NotFound();
            }

            return tblPeriode;
        }

        // PUT: api/Periode/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PuttblPeriode(int id, tblPeriode tblPeriode)
        {
            tblPeriode = await _context.tblPeriode.FindAsync(id);
            if (id != tblPeriode.ID)
            {
                return BadRequest();
            }

            _context.Entry(tblPeriode).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tblPeriodeExists(id))
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

        // PUT: api/Periode/5/activate
        [HttpPut("{id}/activate")]
        public async Task<IActionResult> ActivatePeriode(int id, tblPeriode tblPeriode)
        {
            tblPeriode = await _context.tblPeriode.FindAsync(id);
            if (id != tblPeriode.ID)
            {
                return BadRequest();
            }
            tblPeriode.Aktif = true;
            _context.Entry(tblPeriode).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tblPeriodeExists(id))
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
        // PUT: api/Periode/5/deactivate
        [HttpPut("{id}/deactivate")]
        public async Task<IActionResult> DeactivatePeriode(int id, tblPeriode tblPeriode)
        {
            tblPeriode = await _context.tblPeriode.FindAsync(id);
            if (id != tblPeriode.ID)
            {
                return BadRequest();
            }
            tblPeriode.Aktif = false;
            _context.Entry(tblPeriode).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tblPeriodeExists(id))
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
        // POST: api/Periode
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<tblPeriode>> PosttblPeriode(tblPeriode tblPeriode)
        {
            _context.tblPeriode.Add(tblPeriode);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GettblPeriode", new { id = tblPeriode.ID }, tblPeriode);
        }

        // DELETE: api/Periode/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletetblPeriode(int id)
        {
            var tblPeriode = await _context.tblPeriode.FindAsync(id);
            if (tblPeriode == null)
            {
                return NotFound();
            }

            _context.tblPeriode.Remove(tblPeriode);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool tblPeriodeExists(int id)
        {
            return _context.tblPeriode.Any(e => e.ID == id);
        }
    }
}
