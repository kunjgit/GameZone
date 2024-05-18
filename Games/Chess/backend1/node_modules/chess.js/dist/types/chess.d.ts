/**
 * @license
 * Copyright (c) 2023, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
export declare const WHITE = "w";
export declare const BLACK = "b";
export declare const PAWN = "p";
export declare const KNIGHT = "n";
export declare const BISHOP = "b";
export declare const ROOK = "r";
export declare const QUEEN = "q";
export declare const KING = "k";
export declare type Color = 'w' | 'b';
export declare type PieceSymbol = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export declare type Square = 'a8' | 'b8' | 'c8' | 'd8' | 'e8' | 'f8' | 'g8' | 'h8' | 'a7' | 'b7' | 'c7' | 'd7' | 'e7' | 'f7' | 'g7' | 'h7' | 'a6' | 'b6' | 'c6' | 'd6' | 'e6' | 'f6' | 'g6' | 'h6' | 'a5' | 'b5' | 'c5' | 'd5' | 'e5' | 'f5' | 'g5' | 'h5' | 'a4' | 'b4' | 'c4' | 'd4' | 'e4' | 'f4' | 'g4' | 'h4' | 'a3' | 'b3' | 'c3' | 'd3' | 'e3' | 'f3' | 'g3' | 'h3' | 'a2' | 'b2' | 'c2' | 'd2' | 'e2' | 'f2' | 'g2' | 'h2' | 'a1' | 'b1' | 'c1' | 'd1' | 'e1' | 'f1' | 'g1' | 'h1';
export declare const DEFAULT_POSITION = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
export declare type Piece = {
    color: Color;
    type: PieceSymbol;
};
export declare type Move = {
    color: Color;
    from: Square;
    to: Square;
    piece: PieceSymbol;
    captured?: PieceSymbol;
    promotion?: PieceSymbol;
    flags: string;
    san: string;
    lan: string;
    before: string;
    after: string;
};
export declare const SQUARES: Square[];
export declare function validateFen(fen: string): {
    ok: boolean;
    error: string;
} | {
    ok: boolean;
    error?: undefined;
};
export declare class Chess {
    private _board;
    private _turn;
    private _header;
    private _kings;
    private _epSquare;
    private _halfMoves;
    private _moveNumber;
    private _history;
    private _comments;
    private _castling;
    private _positionCount;
    constructor(fen?: string);
    clear({ preserveHeaders }?: {
        preserveHeaders?: boolean | undefined;
    }): void;
    removeHeader(key: string): void;
    load(fen: string, { skipValidation, preserveHeaders }?: {
        skipValidation?: boolean | undefined;
        preserveHeaders?: boolean | undefined;
    }): void;
    fen(): string;
    private _updateSetup;
    reset(): void;
    get(square: Square): Piece;
    put({ type, color }: {
        type: PieceSymbol;
        color: Color;
    }, square: Square): boolean;
    private _put;
    remove(square: Square): Piece;
    private _updateCastlingRights;
    private _updateEnPassantSquare;
    private _attacked;
    private _isKingAttacked;
    isAttacked(square: Square, attackedBy: Color): boolean;
    isCheck(): boolean;
    inCheck(): boolean;
    isCheckmate(): boolean;
    isStalemate(): boolean;
    isInsufficientMaterial(): boolean;
    isThreefoldRepetition(): boolean;
    isDraw(): boolean;
    isGameOver(): boolean;
    moves(): string[];
    moves({ square }: {
        square: Square;
    }): string[];
    moves({ piece }: {
        piece: PieceSymbol;
    }): string[];
    moves({ square, piece }: {
        square: Square;
        piece: PieceSymbol;
    }): string[];
    moves({ verbose, square }: {
        verbose: true;
        square?: Square;
    }): Move[];
    moves({ verbose, square }: {
        verbose: false;
        square?: Square;
    }): string[];
    moves({ verbose, square, }: {
        verbose?: boolean;
        square?: Square;
    }): string[] | Move[];
    moves({ verbose, piece }: {
        verbose: true;
        piece?: PieceSymbol;
    }): Move[];
    moves({ verbose, piece }: {
        verbose: false;
        piece?: PieceSymbol;
    }): string[];
    moves({ verbose, piece, }: {
        verbose?: boolean;
        piece?: PieceSymbol;
    }): string[] | Move[];
    moves({ verbose, square, piece, }: {
        verbose: true;
        square?: Square;
        piece?: PieceSymbol;
    }): Move[];
    moves({ verbose, square, piece, }: {
        verbose: false;
        square?: Square;
        piece?: PieceSymbol;
    }): string[];
    moves({ verbose, square, piece, }: {
        verbose?: boolean;
        square?: Square;
        piece?: PieceSymbol;
    }): string[] | Move[];
    moves({ square, piece }: {
        square?: Square;
        piece?: PieceSymbol;
    }): Move[];
    private _moves;
    move(move: string | {
        from: string;
        to: string;
        promotion?: string;
    }, { strict }?: {
        strict?: boolean;
    }): Move;
    private _push;
    private _makeMove;
    undo(): Move | null;
    private _undoMove;
    pgn({ newline, maxWidth, }?: {
        newline?: string;
        maxWidth?: number;
    }): string;
    header(...args: string[]): Record<string, string>;
    loadPgn(pgn: string, { strict, newlineChar, }?: {
        strict?: boolean;
        newlineChar?: string;
    }): void;
    private _moveToSan;
    private _moveFromSan;
    ascii(): string;
    perft(depth: number): number;
    private _makePretty;
    turn(): Color;
    board(): ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    squareColor(square: Square): "light" | "dark" | null;
    history(): string[];
    history({ verbose }: {
        verbose: true;
    }): Move[];
    history({ verbose }: {
        verbose: false;
    }): string[];
    history({ verbose }: {
        verbose: boolean;
    }): string[] | Move[];
    private _getPositionCount;
    private _incPositionCount;
    private _decPositionCount;
    private _pruneComments;
    getComment(): string;
    setComment(comment: string): void;
    deleteComment(): string;
    getComments(): {
        fen: string;
        comment: string;
    }[];
    deleteComments(): {
        fen: string;
        comment: string;
    }[];
    setCastlingRights(color: Color, rights: Partial<Record<typeof KING | typeof QUEEN, boolean>>): boolean;
    getCastlingRights(color: Color): {
        k: boolean;
        q: boolean;
    };
    moveNumber(): number;
}
