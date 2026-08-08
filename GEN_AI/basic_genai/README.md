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

## Ragas Evaluation

Ragas can be used to evaluate the quality of the RAG application with a test set containing questions, retrieved contexts, generated answers, and reference answers where available.

### Context Recall

Context recall measures whether the retrieved document chunks contain the information needed to answer the question. A low score usually means that the FAISS search did not retrieve enough relevant context, so chunking, embeddings, or the number of retrieved documents may need improvement.

### LLM Context Precision

LLM context precision measures how much of the retrieved context is relevant to the question. A low score means that retrieval is returning too much unrelated information, which can distract the language model and increase the chance of an incorrect answer.

### Factual Correctness

Factual correctness measures whether the generated answer is accurate and supported by the expected answer or source information. A low score can indicate that the model misunderstood the retrieved context, included unsupported claims, or generated an answer that does not match the reference answer.

### Evaluation flow

```text
Questions and documents
    ↓
Retrieve context from FAISS
    ↓
Generate answers
    ↓
Evaluate with Ragas
    ↓
Review context recall, LLM context precision, and factual correctness
```

Together, these metrics help identify whether a poor result comes from retrieval quality, irrelevant context, or answer generation.
