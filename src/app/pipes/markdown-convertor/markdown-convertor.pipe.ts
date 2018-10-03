import { Pipe, PipeTransform } from '@angular/core';
declare var $: any; // jquery
declare var toMarkdown: any; // to-markdown

@Pipe({
  name: 'markdownConvertor'
})
export class MarkdownConvertorPipe implements PipeTransform {

  transform(value: string): string {
    if (value) {
      return toMarkdown(value,
        {
          gfm: true,
          converters: [
            // list of convertors: HTML tags to Markdown elements
            {
              // strike-through element conversion
              filter: 'span',
              replacement: function (content, node) {
                if (node.getAttribute('style') === 'text-decoration: line-through;') {
                  return '~~' + content + '~~';
                } else {
                  return content;
                }

              }
            },
            {
              // table element conversion
              filter: 'table',
              replacement: function (content, node) {
                // padding for cells
                let cells = content.split('|');
                const largestCell = cells.reduce((r, i) => i.length > r ? i.length : r, 0);
                cells = cells.map((i) => {
                  if (i.length === 0 || i === '\n') {
                    return i;
                  } else {
                    return i + ' '.repeat(largestCell - i.length);
                  }
                });

                content = cells.join('|');

                const firstRow = content.substring(0, content.indexOf('\n', 1));
                const colCount = firstRow.split('|').length - 2;

                let headerRow = '\n';
                const headerCellContent = '-'.repeat(largestCell);
                // check for alignment
                for (let i = 0; i < colCount; i++) {
                  let cellMarkdown = '|' + headerCellContent;
                  if (node.rows[0].cells[i].align === 'right') {
                    cellMarkdown = '|' + headerCellContent.substring(0, largestCell - 1) + ':';
                  } else if (node.rows[0].cells[i].align === 'center') {
                    cellMarkdown = '|:' + headerCellContent.substring(0, largestCell - 2) + ':';
                  }
                  headerRow += cellMarkdown;
                }
                headerRow += '|';

                content = content.replace(firstRow, firstRow + headerRow);
                return content;
              }
            },
            {
              // code element conversion
              filter: 'pre',
              replacement: function (content, node) {
                if (node.getAttribute('class') && node.getAttribute('class').indexOf('language-') > -1) {
                  let lang = node.getAttribute('class').replace('language-', '');
                  lang = lang === 'NA' ? '' : lang;
                  return '```' + (lang || '') + '\n' + content.replace('<code>', '').replace('</code>', '') + '\n```';
                } else {
                  return content;
                }
              }
            },
            {
              // img element conversion
              filter: 'img',
              replacement: function (content, node) {
                const src = $(node).attr('src');
                const alt = $(node).attr('alt');
                const emoji = $(node).attr('data-emoji');

                if (emoji) {
                  return ':' + emoji + ':';
                } else {
                  return '![' + (alt || '') + '](' + (src || '') + ')';
                }
              }
            }
          ]
        });
    } else {
      return '';
    }

  }
}


