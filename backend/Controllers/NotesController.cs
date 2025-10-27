using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NotePadApi.Models;
using System; 
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace NotePadApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    
    public class NotesController : ControllerBase
    {
        // In-memory storage for notes
        private static readonly List<Note> _notes = new List<Note>();

        private string GetUserId()
        {
            // For testing, return a default user ID if not authenticated
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                Console.WriteLine("No user ID found in claims, using default");
                return "default-user-id";
            }
            Console.WriteLine($"Found user ID in claims: {userId}");
            return userId;
        }

        // GET: api/notes
        [HttpGet]
        public IActionResult GetAllNotes()
        {
            //filter with user id in future implementation
            return Ok(_notes.Where(n => n.UserId == GetUserId()));
        }

        // GET: api/notes/{id}
        [HttpGet("{id}")]
        public IActionResult GetNoteById(Guid id)
        {
            var note = _notes.FirstOrDefault(n => n.Id == id && n.UserId == GetUserId());
            if (note == null)
                return NotFound();

            return Ok(note);
        }

        // POST: api/notes
        [HttpPost]
        public IActionResult CreateNote([FromBody] Note note)
        {
            try
            {
                // Log model validation state
                if (!ModelState.IsValid)
                {
                    Console.WriteLine("Model validation failed:");
                    foreach (var state in ModelState)
                    {
                        Console.WriteLine($"Property: {state.Key}");
                        foreach (var error in state.Value.Errors)
                        {
                            Console.WriteLine($"  - Error: {error.ErrorMessage}");
                        }
                    }
                    return BadRequest(ModelState);
                }

                Console.WriteLine($"Received note: Title={note?.Title}, Content={note?.Content?.Substring(0, Math.Min(note?.Content?.Length ?? 0, 20))}...");
                
                // Create a new note object to ensure all properties are properly initialized
                var newNote = new Note
                {
                    Id = Guid.NewGuid(),
                    Title = note.Title ?? string.Empty,
                    Content = note.Content ?? string.Empty,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    UserId = GetUserId()
                };
                
                Console.WriteLine($"Adding note with ID: {newNote.Id}");
                _notes.Add(newNote);

                return CreatedAtAction(nameof(GetNoteById), new { id = newNote.Id}, newNote);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating note: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return BadRequest(new { error = ex.Message });
            }
        }

        // PUT: api/notes/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateNote(Guid id, [FromBody] Note updatedNote)
        {
            try
            {
                // Log model validation state
                if (!ModelState.IsValid)
                {
                    Console.WriteLine("Model validation failed during update:");
                    foreach (var state in ModelState)
                    {
                        Console.WriteLine($"Property: {state.Key}");
                        foreach (var error in state.Value.Errors)
                        {
                            Console.WriteLine($"  - Error: {error.ErrorMessage}");
                        }
                    }
                    return BadRequest(ModelState);
                }

                var existingNote = _notes.FirstOrDefault(n => n.Id == id && n.UserId == GetUserId());
                if (existingNote == null)
                    return NotFound();

                existingNote.Title = updatedNote.Title ?? existingNote.Title;
                existingNote.Content = updatedNote.Content ?? existingNote.Content;
                existingNote.UpdatedAt = DateTime.UtcNow;

                Console.WriteLine($"Updated note with ID: {existingNote.Id}");
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating note: {ex.Message}");
                return BadRequest(new { error = ex.Message });
            }
        }

        // DELETE: api/notes/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteNote(Guid id)
        {
            try
            {
                var note = _notes.FirstOrDefault(n => n.Id == id && n.UserId == GetUserId());
                if (note == null)
                    return NotFound();

                _notes.Remove(note);
                Console.WriteLine($"Deleted note with ID: {id}");
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting note: {ex.Message}");
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}