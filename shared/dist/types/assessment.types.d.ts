export interface AssessmentQuestion {
    id: string;
    type: AssessmentType;
    category: string;
    text: string;
    options: QuestionOption[];
    weight?: number;
}
export interface QuestionOption {
    id: string;
    text: string;
    score: Record<string, number>;
}
export type AssessmentType = 'riasec' | 'big_five' | 'career_values' | 'aptitude';
export interface AssessmentAnswer {
    questionId: string;
    optionId: string;
    score: Record<string, number>;
}
export interface AssessmentSession {
    id: string;
    userId?: string;
    answers: AssessmentAnswer[];
    completedAt?: string;
    createdAt: string;
}
export interface AssessmentResult {
    id: string;
    sessionId: string;
    userId?: string;
    riasecScores: RIASECScores;
    bigFiveScores: BigFiveScores;
    careerValuesScores: CareerValuesScores;
    aptitudeScores: AptitudeScores;
    createdAt: string;
}
export interface RIASECScores {
    R: number;
    I: number;
    A: number;
    S: number;
    E: number;
    C: number;
}
export interface BigFiveScores {
    O: number;
    C: number;
    E: number;
    A: number;
    N: number;
}
export interface CareerValuesScores {
    achievement: number;
    independence: number;
    recognition: number;
    relationships: number;
    support: number;
    working_conditions: number;
}
export interface AptitudeScores {
    verbal: number;
    numerical: number;
    abstract: number;
    spatial: number;
    mechanical: number;
    clerical: number;
}
