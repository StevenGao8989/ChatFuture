export declare const APP_CONFIG: {
    readonly NAME: "ChatFuture";
    readonly VERSION: "1.0.0";
    readonly DESCRIPTION: "AI职业规划与形象生成平台";
    readonly AUTHOR: "ChatFuture Team";
};
export declare const ASSESSMENT_CONFIG: {
    readonly TYPES: readonly ["riasec", "big_five", "career_values", "aptitude"];
    readonly MAX_QUESTIONS_PER_TYPE: 20;
    readonly DEFAULT_TIMEOUT: number;
};
export declare const CARD_CONFIG: {
    readonly STYLES: readonly ["cartoon", "realistic", "anime", "watercolor", "oil_painting"];
    readonly MAX_FILE_SIZE: number;
    readonly ALLOWED_FORMATS: readonly ["image/jpeg", "image/png", "image/webp"];
    readonly GENERATION_TIMEOUT: number;
    readonly CLEANUP_DELAY: number;
};
export declare const API_ENDPOINTS: {
    readonly AUTH: {
        readonly LOGIN: "/auth/login";
        readonly SIGNUP: "/auth/signup";
        readonly LOGOUT: "/auth/logout";
        readonly REFRESH: "/auth/refresh";
        readonly PROFILE: "/auth/profile";
    };
    readonly ASSESSMENT: {
        readonly QUESTIONS: "/assessment/questions";
        readonly SUBMIT: "/assessment/submit";
        readonly RESULT: "/assessment/result";
        readonly HISTORY: "/assessment/history";
    };
    readonly CARD: {
        readonly GENERATE: "/card/generate";
        readonly STATUS: "/card/status";
        readonly GALLERY: "/card/gallery";
        readonly DOWNLOAD: "/card/download";
    };
    readonly STORAGE: {
        readonly UPLOAD: "/storage/upload";
        readonly DELETE: "/storage/delete";
    };
};
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly INTERNAL_SERVER_ERROR: 500;
};
export declare const ERROR_CODES: {
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR";
    readonly AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR";
    readonly NOT_FOUND_ERROR: "NOT_FOUND_ERROR";
    readonly CONFLICT_ERROR: "CONFLICT_ERROR";
    readonly RATE_LIMIT_ERROR: "RATE_LIMIT_ERROR";
    readonly INTERNAL_ERROR: "INTERNAL_ERROR";
};
export declare const QUEUE_NAMES: {
    readonly CARD_GENERATION: "card-generation";
    readonly EMAIL_NOTIFICATION: "email-notification";
    readonly FILE_CLEANUP: "file-cleanup";
    readonly DATA_ANALYTICS: "data-analytics";
};
export declare const CACHE_KEYS: {
    readonly ASSESSMENT_QUESTIONS: "assessment:questions";
    readonly USER_SESSION: "user:session";
    readonly CARD_TEMPLATES: "card:templates";
    readonly SYSTEM_CONFIG: "system:config";
};
export declare const CACHE_TTL: {
    readonly SHORT: number;
    readonly MEDIUM: number;
    readonly LONG: number;
    readonly VERY_LONG: number;
};
