import { describe, expect, it } from 'vitest';
import { isSortValue, isTaskPriority, isTaskStatus, isTaskTypeValue } from './constants';

describe('isTaskStatus', () => {
  it('todoならtrue', () => {
    expect(isTaskStatus('todo')).toBe(true);
  });

  it('in_progressならtrue', () => {
    expect(isTaskStatus('in_progress')).toBe(true);
  });

  it('doneならtrue', () => {
    expect(isTaskStatus('done')).toBe(true);
  });

  it('無効な文字列ならfalse', () => {
    expect(isTaskStatus('invalid')).toBe(false);
  });
});

describe('isTaskPriority', () => {
  it('lowならtrue', () => {
    expect(isTaskPriority('low')).toBe(true);
  });

  it('mediumならtrue', () => {
    expect(isTaskPriority('medium')).toBe(true);
  });

  it('highならtrue', () => {
    expect(isTaskPriority('high')).toBe(true);
  });

  it('無効な文字列ならfalse', () => {
    expect(isTaskPriority('invalid')).toBe(false);
  });
});

describe('isTaskTyoeValue', () => {
  it('normalならtrue', () => {
    expect(isTaskTypeValue('normal')).toBe(true);
  });

  it('spotならtrue', () => {
    expect(isTaskTypeValue('spot')).toBe(true);
  });

  it('無効な文字列ならfalse', () => {
    expect(isTaskTypeValue('invalid')).toBe(false);
  });
});

describe('isSortValue', () => {
  it('有効な文字列のみならtrue', () => {
    expect(isSortValue('')).toBe(true);
    expect(isSortValue('date_asc')).toBe(true);
    expect(isSortValue('date_desc')).toBe(true);
    expect(isSortValue('priority_desc')).toBe(true);
    expect(isSortValue('priority_asc')).toBe(true);
  });

  it('無効な文字列ならfalse', () => {
    expect(isSortValue('invalid')).toBe(false);
  });
});
