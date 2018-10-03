import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild, ElementRef, NgZone } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MarkdownConvertorPipe } from '../../pipes/markdown-convertor/markdown-convertor.pipe';
import { MarkdownService } from '../../services/markdown.service.client';
import { Markdown, Project } from '../../model/model';
import { InteractionsService } from '../../services/interactions.service.client';
import { ErrorHandlerService } from '../../services/error-handler.service.client';
import { ProjectService } from '../../services/project.service.client';

declare var $; // jquery
declare var tinymce: any; // tinyMCE editor
declare var toMarkdown: any; // to-markdown

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.css', '../../../assets/github-markdown.css'],
    encapsulation: ViewEncapsulation.None
})
export class EditorComponent implements OnInit {

    // properties
    private markdownId: string;
    private markdown: Markdown;
    private project: Project;
    private markdownHtml: string;
    private editor: any;
    @ViewChild('inputArea') inputArea: ElementRef;
    @ViewChild('previewTabBody') previewTabBody: ElementRef;
    @ViewChild('modal') editorModal: ElementRef;
    private activeTab: string;
    private compHeight: number;
    private loadComplete: boolean;

    // modal related
    private openModalKey: string;
    private modals: any; // available modal objects

    constructor(private activatedRoute: ActivatedRoute,
        private router: Router,
        private markdownService: MarkdownService,
        private projectService: ProjectService,
        private interactionService: InteractionsService,
        private errorHandlerService: ErrorHandlerService,
        private markdownConvertor: MarkdownConvertorPipe) {
        this.compHeight = window.innerHeight - 172;
        this.loadComplete = false;

        this.modals = {
            'commitToGit': { title: 'Commit to GitHub' },
            'save': { title: 'Save Markdown' }
        };

        // get saved markdown
        this.activatedRoute.paramMap.subscribe((params: any) => {
            this.markdownId = params.get('markdownId');
            if (this.markdownId) {
                // get markdown
                this.markdownService.findMarkdownById(this.markdownId)
                    .subscribe((markdown) => {
                        this.markdown = markdown;
                        if (this.markdown && this.markdown.content) {
                            // check if page reloaded as a result of git login
                            if (localStorage.getItem('openModalOnLoad') !== 'commitToGit') {
                                this.markdownHtml = this.markdown.content;
                            }
                        }
                    }, (err) => {
                        this.errorHandlerService.handleError('Error getting markdown info', err);
                        this.router.navigate(['/']);
                    });

                // get project
                const projectId = params.get('projectId');
                this.projectService.findProjectById(projectId)
                    .subscribe((project) => {
                        if (project) {
                            this.project = project;
                        } else {
                            console.error('Project with id ' + projectId + ' does not exist');
                            this.interactionService.showAlert('Project with id ' + projectId + ' does not exist');
                            this.router.navigate(['/']);
                        }
                    }, (err) => {
                        this.errorHandlerService.handleError('Error getting project', err);
                        this.router.navigate(['/']);
                    });

            }
        });

    }

    ngOnInit() {
        this.activeTab = 'preview';
        let cachedMarkdown = localStorage.getItem('lastEditedMarkdownHtml');

        if (!cachedMarkdown) {
            cachedMarkdown = `<h2><img src="../../../resources/glyphicons/fa/48/bolt.png" />WriteMe.md&nbsp;&nbsp;</h2>
            <p>Create your README.md through this fully equipped, live preview online editor</p>
            <hr />
            <h4>Features:</h4>
            <p>Text, Heading, <em>basic</em> <strong>formatting,&nbsp;</strong><a href="http://meetvikas.net/">links</a></p>
            <p><strong>Lists</strong></p>
            <ol>
            <li>with numbers</li>
            <li>like this</li>
            </ol>
            <ul>
            <li>or bullets</li>
            <li>like this
            <ul>
            <li>with nested lists support</li>
            </ul>
            </li>
            </ul>
            <p><strong>Tables</strong></p>
            <table style="border-collapse: collapse; width: 100%;" border="1">
            <tbody>
            <tr>
            <td style="width: 33.3333%; text-align: right;" align="right">Aligned Right</td>
            <td style="width: 33.3333%; text-align: center;" align="center">Aligned Center</td>
            <td style="width: 33.3333%;">Aligned Left</td>
            </tr>
            <tr>
            <td style="width: 33.3333%;" align="right">gets</td>
            <td style="width: 33.3333%;" align="center">generated</td>
            <td style="width: 33.3333%;">as</td>
            </tr>
            <tr>
            <td style="width: 33.3333%; text-align: right;" align="right">neatly</td>
            <td style="width: 33.3333%; text-align: center;" align="center">aligned</td>
            <td style="width: 33.3333%;">table markdown</td>
            </tr>
            </tbody>
            </table>
            <p><strong>Code</strong></p>
            <pre class="language-java"><code>public static void main(String[] args) {
                System.out.println("Hello World");
            }</code></pre>
            <p>also with <code>inline code</code> support</p>
            <p><strong>Image Support</strong></p>
            <p><strong><img src="https://i.pinimg.com/736x/71/df/db/71dfdb45ba647c5f0951dc0eec9815dc--computer` +
            `-jokes-computer-technology.jpg" alt="Sample Image" /></strong></p>
            <p>Custom Size</p>
            <p><img src="https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?` +
            `url=https://i.pinimg.com/736x/71/df/db/71dfdb45ba647c5f0951dc0eec9815dc--computer-jokes-computer-technology.jpg` +
            `&container=focus&resize_w=192&resize_h=192" alt="" /></p>
            <p>Search and Insert Icons: <em>(powered by IconsFinder.com)</em></p>
            <p><img src="https://cdn2.iconfinder.com/data/icons/snipicons/500/computer-64.png"
            alt="" />&nbsp;<img src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/cat-64.png"
             alt="" />&nbsp;<img src="https://cdn2.iconfinder.com/data/icons/snipicons/500/phone-64.png" alt="" /></p>
            <p>Font-Awesome Glyphs</p>
            <p><img src="../../../resources/glyphicons/fa/24/desktop.png" />
            &nbsp;<img src="../../../resources/glyphicons/fa/32/desktop.png" />
            &nbsp;<img src="../../../resources/glyphicons/fa/48/desktop.png" />
            &nbsp;<img src="../../../resources/glyphicons/fa/64/desktop.png" />&nbsp;&nbsp;</p>
            <p>Git supported Emojis</p>
            <p><img class="emoji" src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f44d.png"
             width="20" height="20" data-emoji="+1" />&nbsp;<img class="emoji"
              src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f3b1.png"
              width="20" height="20" data-emoji="8ball" />&nbsp;<img class="emoji"
              src="https://assets-cdn.github.com/images/icons/emoji/unicode/2708.png"
              width="20" height="20" data-emoji="airplane" />&nbsp;<img class="emoji"
              src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f3c1.png"
              width="20" height="20" data-emoji="checkered_flag" /></p>
            <p><strong>Link to Youtube Vidoes</strong></p>
            <p><a href="https://www.youtube.com/watch?v=6ZfuNTqbHE8"><img class="youtube"
            src="http://img.youtube.com/vi/6ZfuNTqbHE8/0.jpg" alt="Sample Youtube link" /></a></p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>`;
        }

        if (cachedMarkdown && !this.markdownHtml) {
            this.markdownHtml = cachedMarkdown;
        }

        // mobile view: show editor and hide preview
        if ($('.mobile-view-toggles').is(':visible')) {
            $('#preview-wrapper').removeClass('show');
            // show editor toggle
            $('#show-editor-toggle').click(function () {
                $('#preview-wrapper').collapse('hide');
                $('#editor-wrapper').collapse('show');
                $('#show-editor-toggle').addClass('btn-success');
                $('#show-preview-toggle').removeClass('btn-success');
            });
            // show preview toggle
            $('#show-preview-toggle').click(function () {
                $('#preview-wrapper').collapse('show');
                $('#editor-wrapper').collapse('hide');
                $('#show-editor-toggle').removeClass('btn-success');
                $('#show-preview-toggle').addClass('btn-success');
            });
        }


    }

    onEditorLoad() {
        this.loadComplete = true;

        // open modals on load if required
        this.openModal(localStorage.getItem('openModalOnLoad'));
        localStorage.removeItem('openModalOnLoad');
    }

    /** Download markdown file */
    download() {
        const markdown = this.markdownConvertor.transform(this.markdownHtml);
        const textFileAsBlob = new Blob([markdown], { type: 'text/plain' });
        const fileName = 'README.md';

        const downloadLink = document.createElement('a');
        downloadLink.download = fileName;
        downloadLink.innerHTML = 'Download README.md';
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = (e: any) => { document.body.removeChild(e.target); };
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);

        downloadLink.click();
    }

    /** Show commit-to-git modal */
    showCommitToGitModal() {
        this.openModal('commitToGit');
    }

    /** Save markdown */
    save() {
        if (this.markdown && this.markdown._id) {
            this.interactionService.showLoader(true);
            this.markdown.content = this.markdownConvertor.transform(this.markdownHtml);
            this.markdownService.updateMarkdown(this.markdown._id, this.markdown)
                .subscribe((updatedMarkdown) => {
                    this.markdown = updatedMarkdown;
                    this.interactionService.showLoader(false);
                    this.interactionService.showAlert('Saved successfully', 'success', true);
                }, (err) => {
                    this.interactionService.showLoader(false);
                    this.errorHandlerService.handleError('Error saving markdown', err);
                });
        } else {
            this.showSaveModal();
        }

    }

    /** Show save markdown modal */
    showSaveModal() {
        if (!this.markdown) {
            this.markdown = {
                content: this.markdownHtml
            };
        }

        this.openModal('save');
    }

    /** Open modal corresponding to the specified key */
    openModal(key: string) {
        if (key) {
            this.openModalKey = key;
            $(this.editorModal.nativeElement).modal('show');
        }
    }

    /** Close open modal */
    closeModal(data) {
        if (this.openModalKey === 'save') {
            this.markdown = data;
        }

        this.openModalKey = null;
        $(this.editorModal.nativeElement).modal('hide');
    }

}
