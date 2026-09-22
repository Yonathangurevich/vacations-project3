// section type model
export type AiSectionModel = {
    emoji: string;
    title: string;
    intro: string;
    highlights: string[];
    tip: string;
}

// The whole guide, as the model returns it:
export type AiRecommendationModel = {
    title: string;
    sections: AiSectionModel[];
}