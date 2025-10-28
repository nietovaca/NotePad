using NotePadApi.DTOs;
using NotePadApi.Models;
using NotePadApi.Repositories;
using Microsoft.Extensions.Logging;

namespace NotePadApi.Services

   // This service implements business logic for note operations following the Single Responsibility Principle.
   // It acts as an intermediary between controllers and repositories, handling data transformation,
   // validation, and enforcing business rules while isolating these concerns from other layers.

{
    public class NoteService : INoteService
    {
        // Repository dependency for data persistence operations, injected to support loose coupling
        private readonly INoteRepository _noteRepository;

        // Logger for capturing operation outcomes and diagnostic information
        // Structured to support monitoring and troubleshooting in production
        private readonly ILogger<NoteService> _logger;

           // Implements dependency injection pattern to support testability and loose coupling
        public NoteService(INoteRepository noteRepository, ILogger<NoteService> logger)
        {
            _noteRepository = noteRepository;
            _logger = logger;
        }

        // Retrieves all notes for a specific user, applying any necessary filtering or sorting
        // Demonstrates functional programming approach by using LINQ for data transformation and logging.
        public IEnumerable<NoteResponse> GetAllNotes(string userId)
        {
            var notes = _noteRepository.GetAllByUserId(userId);
            _logger.LogInformation("Retrieved {count} notes for user: {userId}", notes.Count(), userId);
            return notes.Select(MapToNoteResponse);
        }

       
        // Retrieves a single note by its ID for a specific user, applying logging for diagnostic purposes
        // Demonstrates defensive programming by handling null cases gracefully and returning null if not found
        public NoteResponse? GetNoteById(Guid id, string userId)
        {
            var note = _noteRepository.GetById(id, userId);
            if (note != null)
                _logger.LogInformation("Retrieved note {NoteId} for user {UserId}", id, userId);
            else
                _logger.LogWarning("Note {NoteId} not found for or accessible by user: {UserId}", id, userId);
            return note != null ? MapToNoteResponse(note) : null;
        }

        
        // Creates a new note for a specific user, applying logging for diagnostic purposes
        // Demonstrates object-oriented programming by using a new keyword to create a new note object
        public NoteResponse CreateNote(CreateNoteRequest noteDto, string userId)
        {
            var note = new Note
            {
                Id = Guid.NewGuid(),
                Title = noteDto.Title,
                Content = noteDto.Content,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var createdNote = _noteRepository.Add(note);
            _logger.LogInformation("Created note {NoteId} for user {UserId}", createdNote.Id, userId);
            return MapToNoteResponse(createdNote);
        }

        // Updates an existing note for a specific user, applying logging for diagnostic purposes
        public bool UpdateNote(Guid id, UpdateNoteRequest noteDto, string userId)
        {
            var existingNote = _noteRepository.GetById(id, userId);
            _logger.LogInformation("Attempting to update note {NoteId} for user {UserId}", id, userId);
               if (existingNote == null)
                {
                    _logger.LogWarning("Failed to update: Note {NoteId} not found or not accessible by user {UserId}", id, userId);
                    return false;
                }

            existingNote.Title = noteDto.Title;
            existingNote.Content = noteDto.Content;
            existingNote.UpdatedAt = DateTime.UtcNow;

            var updated = _noteRepository.Update(existingNote);
               if (updated)
               {    
                    _logger.LogInformation("Updated note {NoteId} for user {UserId}", id, userId);
                    return true;
                }
                else
                {
                    _logger.LogWarning("Failed to update note {NoteId} for user {UserId}", id, userId);
                    return false;
                }
        }

        // Deletes a note by its ID for a specific user, applying logging for diagnostic purposes
        public bool DeleteNote(Guid id, string userId)
        {
            var deleted = _noteRepository.Delete(id, userId);
               if (deleted)
               {
                    _logger.LogInformation("Deleted note {NoteId} for user {UserId}", id, userId);
                }
                else
                {
                    _logger.LogWarning("Failed to delete: Note {NoteId} not found or not accessible by user {UserId}", id, userId);
                }
            return deleted;
        }

        // Maps a Note domain model to a NoteResponse DTO for presentation layer
        private static NoteResponse MapToNoteResponse(Note note)
        {
            return new NoteResponse
            {
                Id = note.Id,
                Title = note.Title,
                Content = note.Content,
                CreatedAt = note.CreatedAt,
                UpdatedAt = note.UpdatedAt
            };
        }
    }
}
