using NotePadApi.Models;
using System.Collections.Concurrent;

namespace NotePadApi.Repositories
{
    public class InMemoryNoteRepository : INoteRepository
    {
        // Thread-safe collection for storing notes
        private static readonly ConcurrentBag<Note> _notes = new ConcurrentBag<Note>();

        public IEnumerable<Note> GetAllByUserId(string userId) => 
            _notes.Where(n => n.UserId == userId).ToList();

        public Note? GetById(Guid id, string userId) => 
            _notes.FirstOrDefault(n => n.Id == id && n.UserId == userId);

        public Note Add(Note note)
        {
            _notes.Add(note);
            return note;
        }

        public bool Update(Note updatedNote)
        {
            // Since ConcurrentBag doesn't support direct updates, we need to create a new collection
            var notesToKeep = _notes.Where(n => n.Id != updatedNote.Id || n.UserId != updatedNote.UserId).ToList();
            
            // Clear and repopulate the collection
            _notes.Clear();
            foreach (var note in notesToKeep)
            {
                _notes.Add(note);
            }
            
            _notes.Add(updatedNote);
            return true;
        }

        public bool Delete(Guid id, string userId)
        {
            var notesToKeep = _notes.Where(n => n.Id != id || n.UserId != userId).ToList();
            
            // If counts are the same, nothing was removed
            if (notesToKeep.Count == _notes.Count)
                return false;
            
            // Clear and repopulate the collection
            _notes.Clear();
            foreach (var note in notesToKeep)
            {
                _notes.Add(note);
            }
            
            return true;
        }
    }
}
