using NotePadApi.Models;

namespace NotePadApi.Repositories
{
    //repository interface for data access operations on notes
    //handles data storage and retrieval for notes without any business logic
    public interface INoteRepository
    {
        IEnumerable<Note> GetAllByUserId(string userId);
        Note? GetById(Guid id, string userId);
        Note Add(Note note);
        bool Update(Note note);
        bool Delete(Guid id, string userId);
    }
}

