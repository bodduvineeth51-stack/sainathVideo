import React from 'react';
import {Brothers, Compare, Father, LakshmanSpec, NotRequired, Nothing, RamPrompt, Task, Victory} from './Story';
import {AITool, Architecture, Complex, Era, Judge, Process, Syntax} from './Concepts';
import type {SceneProps} from './types';

// Title3D is special-cased in Reel.tsx because it reveals the footage through its exit.
export const SCENES: Record<string, React.FC<SceneProps>> = {
  NotRequired, Brothers, Father, Task, RamPrompt, LakshmanSpec, Compare, Victory, Nothing,
  Syntax, Complex, AITool, Process, Architecture, Judge, Era,
};
