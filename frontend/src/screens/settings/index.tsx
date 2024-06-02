import { Alert, Button, Tabs } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Link, RichTextEditor } from "@mantine/tiptap";
import { useQuery } from "@tanstack/react-query";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { IoChatboxOutline } from "react-icons/io5";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import httpService from "../../common/http-service";
import Page from "../../components/page";

export default function Setting() {
  const [template, setTemplate] = useState("");
  const editor = useEditor({
    extensions: [StarterKit, Link],
    onUpdate(e) {
      setTemplate(e.editor.getHTML());
    },
  });

  const { data: messageTemplate } = useQuery({
    queryKey: ["getMessageTemplate"],
    queryFn: () => httpService.get<string>("api/v1/settings/message-template"),
  });

  const saveMessageTemplate = () => {
    if (!template) {
      notifications.show({
        title: "Error",
        message: "Please provide message template",
        color: "red",
      });
      return;
    }

    httpService.post(`api/v1/settings/message-template`, {
      template,
    });
  };

  return (
    <Page>
      <Tabs defaultValue="alert">
        <Tabs.List>
          <Tabs.Tab value="alert" leftSection={<IoChatboxOutline />}>
            Message Template
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="alert" className="py-5">
          <Alert>{messageTemplate}</Alert>
          <div className="grid grid-cols-2 gap-3 py-5">
            <div className="flex flex-col gap-2">
              <RichTextEditor editor={editor}>
                <RichTextEditor.Toolbar sticky stickyOffset={60}>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                    <RichTextEditor.Highlight />
                    <RichTextEditor.Code />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                    <RichTextEditor.H4 />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Blockquote />
                    <RichTextEditor.Hr />
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                    <RichTextEditor.Subscript />
                    <RichTextEditor.Superscript />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Link />
                    <RichTextEditor.Unlink />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.AlignLeft />
                    <RichTextEditor.AlignCenter />
                    <RichTextEditor.AlignJustify />
                    <RichTextEditor.AlignRight />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Undo />
                    <RichTextEditor.Redo />
                  </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content className="min-h-[300px]" />
              </RichTextEditor>
            </div>
            <div className="rounded border border-green-200 bg-green-50 p-3 text-sm">
              <Markdown rehypePlugins={[rehypeRaw]}>{template}</Markdown>
            </div>
          </div>
          <Button variant="outline">Save Template</Button>
        </Tabs.Panel>
      </Tabs>
    </Page>
  );
}
