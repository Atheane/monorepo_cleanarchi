import { CompiledHTMLType } from './CompiledHTML';
import { CompiledSettings } from './CompiledSettings';

export interface IProcess {
  compiled(payload: any, compiledSettings: CompiledSettings): Promise<CompiledHTMLType>;
}
