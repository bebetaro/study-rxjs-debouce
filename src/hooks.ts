import { useState, useEffect } from "react";
import { Observable, of } from "rxjs";
import { useObservable } from "rxjs-hooks";
import {
  debounceTime,
  switchMap,
  tap,
  pluck,
  filter,
  scan,
  map,
  distinctUntilChanged,
  delay,
} from "rxjs/operators";

export function useRx<T, X>(
  stream: (c: X) => Observable<T>,
  initialValue: X,
  onErr?: (error: any) => void,
  onComplete?: () => void
): [T] {
  // Output state
  const [outState, _setOutState] = useState<T | undefined>(undefined);

  useEffect(() => {
    const s = stream(initialValue).subscribe(
      (x) => _setOutState(x),
      onErr,
      onComplete
    );
    return () => s.unsubscribe();
  }, [initialValue, onComplete, onErr, stream]);

  return [outState as T];
}

export const useSearch = (word: string): string[] =>
  useObservable(
    (word$) =>
      word$.pipe(
        debounceTime(400),
        map((v) => v)
      ),
    [], // 結果の初期値
    [word] // input。配列にして渡す必要があることに注意
  );
