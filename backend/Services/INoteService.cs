using NotePadApi.DTOs;

namespace NotePadApi.Services
//services layer interface for note service
//this layer is responsible for the business logic of the note service
//it transforms the data from the repository layer to the DTO layer and vice versa
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

