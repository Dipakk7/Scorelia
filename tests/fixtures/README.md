# Resume Parser Test Fixtures

This directory contains test files used to verify the functionality of the resume text extraction engine.

## Files

1. **`sample_resume.pdf`**:
   - A valid PDF resume containing basic text for a profile: "John Doe", "Software Engineer", and a "Skills" section listing "Python", "FastAPI", "SQL", and "Docker".
   - Used to verify standard PDF text extraction.

2. **`sample_resume.docx`**:
   - A valid DOCX resume with content equivalent to `sample_resume.pdf`.
   - Used to verify standard DOCX text extraction (including headers, footers, paragraphs, and tables).

3. **`corrupt_file.pdf`**:
   - A corrupted file containing random bytes that mimics a damaged PDF download or corrupt upload.
   - Used to verify that corrupted documents are rejected with a descriptive exception (`ValueError("Unable to read PDF file.")`).

4. **`empty_file.pdf`**:
   - A zero-byte file representing an empty upload.
   - Used to verify that empty documents are gracefully handled or rejected.

5. **`password_protected.pdf`**:
   - A valid PDF file encrypted with a password user/owner keys.
   - Used to verify that password-protected files are rejected with a descriptive exception (`ValueError("Password protected PDF is not supported.")`).

6. **`scanned_resume.pdf`**:
   - A blank PDF page containing no extractable text, simulating a scanned document or images without OCR.
   - Used to verify that scanned/image PDFs return an empty string instead of raising an exception, and trigger the `resume_pdf_no_text` event.
