using NotePadApi.DTOs;
using NotePadApi.Models;
using NotePadApi.Repositories;

namespace NotePadApi.Services
{
    public class NoteService : INoteService
    {
        private readonly INoteRepository _noteRepository;

        public NoteService(INoteRepository noteRepository)
        {
            _noteRepository = noteRepository;
        }

        public IEnumerable<NoteResponse> GetAllNotes(string userId)
        {
            var notes = _noteRepository.GetAllByUserId(userId);
            return notes.Select(MapToNoteResponse);
        }

        public NoteResponse? GetNoteById(Guid id, string userId)
        {
            var note = _noteRepository.GetById(id, userId);
            return note != null ? MapToNoteResponse(note) : null;
        }

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
            return MapToNoteResponse(createdNote);
        }

        public bool UpdateNote(Guid id, UpdateNoteRequest noteDto, string userId)
        {
            var existingNote = _noteRepository.GetById(id, userId);
            if (existingNote == null)
                return false;

            existingNote.Title = noteDto.Title;
            existingNote.Content = noteDto.Content;
            existingNote.UpdatedAt = DateTime.UtcNow;

            return _noteRepository.Update(existingNote);
        }

        public bool DeleteNote(Guid id, string userId)
        {
            return _noteRepository.Delete(id, userId);
        }

        // Helper method to map from domain model to DTO
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
