using NotePadApi.DTOs;

namespace NotePadApi.Services
{
    public interface INoteService
    {
        IEnumerable<NoteResponse> GetAllNotes(string userId);
        NoteResponse? GetNoteById(Guid id, string userId);
        NoteResponse CreateNote(CreateNoteRequest noteDto, string userId);
        bool UpdateNote(Guid id, UpdateNoteRequest noteDto, string userId);
        bool DeleteNote(Guid id, string userId);
    }
}
