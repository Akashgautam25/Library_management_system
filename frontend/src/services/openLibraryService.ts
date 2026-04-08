import axios from 'axios';
import { Book } from '../types';

const OL_BASE = 'https://openlibrary.org';

interface OLSearchDoc {
    key: string;
    title: string;
    author_name?: string[];
    isbn?: string[];
    subject?: string[];
    first_publish_year?: number;
    publisher?: string[];
    cover_i?: number;
}

interface OLSearchResponse {
    docs: OLSearchDoc[];
    numFound: number;
}

// Map Open Library doc to our Book type
const mapToBook = (doc: OLSearchDoc): Book => ({
    _id: doc.key.replace('/works/', ''),
    title: doc.title,
    author: doc.author_name?.[0] || 'Unknown Author',
    isbn: doc.isbn?.[0] || '',
    category: doc.subject?.[0] || 'Other',
    description: '',
    quantity: 1,
    availableQuantity: 1,
    publishedYear: doc.first_publish_year || 0,
    publisher: doc.publisher?.[0] || '',
    coverUrl: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : '',
    createdAt: '',
    updatedAt: '',
});

export const openLibraryService = {
    async getBookByWorkId(workId: string): Promise<Book> {
        const res = await axios.get(`${OL_BASE}/works/${workId}.json`);
        const w = res.data;

        // fetch description — can be string or object
        let description = '';
        if (typeof w.description === 'string') description = w.description;
        else if (w.description?.value) description = w.description.value;

        // get cover
        const coverId = w.covers?.[0];
        const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : '';

        // get author name
        let author = 'Unknown Author';
        if (w.authors?.[0]?.author?.key) {
            try {
                const authorRes = await axios.get(`${OL_BASE}${w.authors[0].author.key}.json`);
                author = authorRes.data.name || 'Unknown Author';
            } catch {}
        }

        return {
            _id: workId,
            title: w.title,
            author,
            isbn: '',
            category: w.subjects?.[0] || 'Other',
            description,
            quantity: 1,
            availableQuantity: 1,
            publishedYear: w.first_publish_date ? parseInt(w.first_publish_date) : 0,
            publisher: '',
            coverUrl,
            createdAt: '',
            updatedAt: '',
        };
    },

    async searchBooks(query: string, limit = 20): Promise<Book[]> {
        const res = await axios.get<OLSearchResponse>(`${OL_BASE}/search.json`, {
            params: { q: query, limit, fields: 'key,title,author_name,isbn,subject,first_publish_year,publisher,cover_i' },
        });
        return res.data.docs.map(mapToBook);
    },

    async searchBySubject(subject: string, limit = 20): Promise<Book[]> {
        const res = await axios.get(`${OL_BASE}/subjects/${encodeURIComponent(subject.toLowerCase())}.json`, {
            params: { limit },
        });
        return (res.data.works || []).map((w: any): Book => ({
            _id: w.key.replace('/works/', ''),
            title: w.title,
            author: w.authors?.[0]?.name || 'Unknown Author',
            isbn: '',
            category: subject,
            description: '',
            quantity: 1,
            availableQuantity: 1,
            publishedYear: w.first_publish_year || 0,
            publisher: '',
            coverUrl: w.cover_id
                ? `https://covers.openlibrary.org/b/id/${w.cover_id}-M.jpg`
                : '',
            createdAt: '',
            updatedAt: '',
        }));
    },
};
