/**
 * ExternalBookService - Fetches and transforms book data from Open Library API
 */
export interface ExternalBook {
    title: string;
    author: string;
    first_publish_year: number | null;
    isbn: string | null;
    cover: string | null;
    subjects: string[];
}

export class ExternalBookService {
    private readonly BASE_URL = 'https://openlibrary.org/search.json';
    private readonly COVER_URL = 'https://covers.openlibrary.org/b/id';

    async searchBooks(query: string, subject?: string, page = 1, limit = 20): Promise<ExternalBook[]> {
        const offset = (page - 1) * limit;
        const url = `${this.BASE_URL}?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch from Open Library');

        const data = await response.json() as { docs: any[] };
        let books = data.docs.map((doc) => this.transform(doc));

        if (subject) {
            const lower = subject.toLowerCase();
            books = books.filter((b) =>
                b.subjects.some((s) => s.toLowerCase().includes(lower))
            );
        }

        return books;
    }

    private transform(doc: any): ExternalBook {
        return {
            title: doc.title || 'Unknown Title',
            author: doc.author_name?.[0] ?? 'Unknown Author',
            first_publish_year: doc.first_publish_year ?? null,
            isbn: doc.isbn?.[0] ?? null,
            cover: doc.cover_i ? `${this.COVER_URL}/${doc.cover_i}-M.jpg` : null,
            subjects: doc.subject ? (doc.subject as string[]).slice(0, 3) : [],
        };
    }
}
