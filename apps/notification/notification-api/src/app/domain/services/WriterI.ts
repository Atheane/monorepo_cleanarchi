import { CompiledHTMLType } from '../types/CompiledHTMLType';
import { CompiledSettingsType } from '../types/CompiledSettingsType';
import { PayloadType } from '../types/PayloadType';

export interface WriterI {
  generate(payload: PayloadType, config: CompiledSettingsType): Promise<CompiledHTMLType>;
}
