export interface Exercise {
    run(input: Blob): Promise<void>;
}