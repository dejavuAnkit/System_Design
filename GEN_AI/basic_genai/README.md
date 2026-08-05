# Basic RAG Application with FAISS

This project is a simple Retrieval-Augmented Generation (RAG) application that answers questions using documents stored in a vector database.

## What this project does

The application:
1. Loads a set of text documents.
2. Splits them into smaller chunks.
3. Converts those chunks into embeddings.
4. Stores the embeddings in FAISS for fast semantic search.
5. Receives a user question.
6. Retrieves the most relevant document chunks.
7. Uses the retrieved context to generate an answer.

## Why FAISS

FAISS is used for efficient vector similarity search. It helps the app quickly find the document chunks that are most relevant to a given question.

## Simple RAG flow

```text
User Question
    ↓
Embed the question
    ↓
Search FAISS for similar document chunks
    ↓
Retrieve top matching context
    ↓
Generate final answer using the retrieved context
```

## Main idea

Instead of answering only from the model’s general knowledge, the app first retrieves relevant information from provided documents and then uses that content to answer the question.

## Typical use case

This pattern is useful for:
- document Q&A systems
- internal knowledge assistants
- enterprise search tools
- chatbot systems grounded in your own data

## Summary

This basic app demonstrates the core RAG pipeline:
- document retrieval using FAISS
- question understanding
- context-based answer generation
