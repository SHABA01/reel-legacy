/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';
import { NarrationVersion, VoiceProfile } from '../types/narration';

export type AIActionType =
  | 'generate_scene'
  | 'generate_paragraph'
  | 'rewrite_natural'
  | 'make_emotional'
  | 'make_cinematic'
  | 'make_conversational'
  | 'slow_down'
  | 'shorten'
  | 'expand'
  | 'variations'
  | 'improve_flow'
  | 'match_previous'
  | 'maintain_tone';

export class VoiceGenerationService {
  /**
   * Generates or transforms narration text using AI
   */
  public static async transformText(
    text: string,
    action: AIActionType,
    context?: { tone?: string; sceneTitle?: string; previousText?: string }
  ): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = this.buildPromptForAction(text, action, context);
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
        });
        const resultText = response.text;
        if (resultText && resultText.trim().length > 5) {
          return resultText.trim().replace(/^["']|["']$/g, '');
        }
      } catch (err) {
        console.warn('Gemini AI text transformation fallback to smart processor:', err);
      }
    }

    // Smart localized fallback processor if API key isn't provided or offline
    return this.smartFallbackTransform(text, action, context);
  }

  /**
   * Synthesizes an AI voice clip version for a narration segment
   */
  public static async generateVoiceClip(
    text: string,
    voice: VoiceProfile,
    actionLabel: string = 'AI Voice Generation'
  ): Promise<NarrationVersion> {
    // Simulate generation latency for realistic studio experience
    await new Promise(resolve => setTimeout(resolve, 1800));

    const wordCount = text.trim().split(/\s+/).length;
    const durationSec = Math.max(4, Math.round((wordCount / (2.2 * voice.speed)) * 10) / 10);

    // Generate random realistic audio waveform bars
    const waveformData: number[] = Array.from({ length: 16 }, () =>
      parseFloat((0.2 + Math.random() * 0.75).toFixed(2))
    );

    return {
      id: `ai-ver-${Date.now()}`,
      type: 'ai_generated',
      label: `${actionLabel} (${voice.name})`,
      durationSec,
      createdAt: new Date().toISOString(),
      createdBy: `AI Voice Studio (${voice.name})`,
      audioUrl: 'https://actions.google.com/sounds/v1/ambiences/waves_crashing.ogg',
      waveformData,
      isSelected: true
    };
  }

  private static buildPromptForAction(
    text: string,
    action: AIActionType,
    context?: { tone?: string; sceneTitle?: string; previousText?: string }
  ): string {
    const contextInfo = context?.sceneTitle ? `Scene: ${context.sceneTitle}. ` : '';

    switch (action) {
      case 'rewrite_natural':
        return `${contextInfo}Rewrite the following documentary narration script to sound completely natural, authentic, and spoken aloud by a family storyteller. Keep key details intact:\n"${text}"`;
      case 'make_emotional':
        return `${contextInfo}Enhance the emotional intimacy and poetic warmth of this documentary narration script:\n"${text}"`;
      case 'make_cinematic':
        return `${contextInfo}Elevate this script with a grand, cinematic documentary tone suitable for a Ken Burns or BBC film:\n"${text}"`;
      case 'make_conversational':
        return `${contextInfo}Make this script relaxed, casual, and conversational as if sitting around a fireplace:\n"${text}"`;
      case 'shorten':
        return `${contextInfo}Condense this documentary script by 30% while retaining the core historical narrative:\n"${text}"`;
      case 'expand':
        return `${contextInfo}Expand this narration with vivid atmospheric sensory details (sounds, weather, lighting):\n"${text}"`;
      case 'improve_flow':
        return `${contextInfo}Optimize the cadence, rhythm, and breath pauses of this narration for voiceover recording:\n"${text}"`;
      case 'match_previous':
        return `${contextInfo}Adjust the narrative rhythm and style of this text to seamlessly flow from the previous scene ("${context?.previousText || ''}"):\n"${text}"`;
      default:
        return `${contextInfo}Polishing narration text for voiceover:\n"${text}"`;
    }
  }

  private static smartFallbackTransform(
    text: string,
    action: AIActionType,
    context?: { tone?: string; sceneTitle?: string; previousText?: string }
  ): string {
    switch (action) {
      case 'rewrite_natural':
        return text
          .replace(/accepted the chair of/g, 'took over as head of')
          .replace(/unconventional/g, 'deeply personal')
          .concat(' It was a time no one in the family ever forgot.');
      case 'make_emotional':
        return `Looking back now, ${text.charAt(0).toLowerCase()}${text.slice(1)} Every word carried the quiet weight of love.`;
      case 'make_cinematic':
        return `Beneath the sweeping expanse of the New England sky, ${text.charAt(0).toLowerCase()}${text.slice(1)}`;
      case 'make_conversational':
        return `You know, ${text.charAt(0).toLowerCase()}${text.slice(1)}`;
      case 'shorten':
        return text.split('. ')[0] + '.';
      case 'expand':
        return `${text} The quiet rustle of sea grass and the distant ring of harbor bells echoed through the evening.`;
      case 'improve_flow':
        return text.replace(/,/g, ' —').replace(/\./g, '... ');
      default:
        return text;
    }
  }
}
