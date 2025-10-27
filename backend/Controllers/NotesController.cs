using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NotePadApi.DTOs;
using NotePadApi.Services;

namespace NotePadApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotesController : ControllerBase
    {
        private readonly INoteService _noteService;
        private readonly IUserService _userService;

        public NotesController(INoteService noteService, IUserService userService)
        {
            _noteService = noteService;
            _userService = userService;
        }

        // GET: api/notes
        [HttpGet]
        public IActionResult GetAllNotes()
        {
            var userId = _userService.GetUserId(User);
            var notes = _noteService.GetAllNotes(userId);
            return Ok(notes);
        }

        // GET: api/notes/{id}
        [HttpGet("{id}")]
        public IActionResult GetNoteById(Guid id)
        {
            var userId = _userService.GetUserId(User);
            var note = _noteService.GetNoteById(id, userId);
            
            if (note == null)
                return NotFound();

            return Ok(note);
        }

        // POST: api/notes
        [HttpPost]
        public IActionResult CreateNote([FromBody] CreateNoteRequest noteDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var userId = _userService.GetUserId(User);
                var createdNote = _noteService.CreateNote(noteDto, userId);
                
                return CreatedAtAction(
                    nameof(GetNoteById), 
                    new { id = createdNote.Id }, 
                    createdNote
                );
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // PUT: api/notes/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateNote(Guid id, [FromBody] UpdateNoteRequest noteDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var userId = _userService.GetUserId(User);
                var success = _noteService.UpdateNote(id, noteDto, userId);
                
                if (!success)
                    return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // DELETE: api/notes/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteNote(Guid id)
        {
            try
            {
                var userId = _userService.GetUserId(User);
                var success = _noteService.DeleteNote(id, userId);
                
                if (!success)
                    return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}