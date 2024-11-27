import { Prompt } from "@medusajs/ui";

export default function ConfirmPrompt({ resolve, lang, title=lang.general.sure }) {
  return (
    <>
      <Prompt variant="danger" defaultOpen={true}>
        <Prompt.Content className="z-20 max-w-[90vw] md:max-w-[400px]">
          <Prompt.Header>
            <Prompt.Title>{title}</Prompt.Title>
            <Prompt.Description>
              {lang.general.pleaseConfirm}
            </Prompt.Description>
          </Prompt.Header>
          <Prompt.Footer>
            <Prompt.Cancel onClick={() => resolve(false)}>
              {lang.general.cancel}
            </Prompt.Cancel>
            <Prompt.Action onClick={() => resolve(true)}>
              {lang.general.imSure}
            </Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </>
  );
}
