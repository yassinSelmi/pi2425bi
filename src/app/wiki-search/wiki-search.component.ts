import { Component } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-wiki-search',
  templateUrl: './wiki-search.component.html',
  styleUrls: ['./wiki-search.component.css']
})
export class WikiSearchComponent {
  query = '';
  results: any = null;
  isLoading = false;
  error = '';
  lastSearches: string[] = [];

  constructor(private apiService: ApiService) {}

  search() {
    if (!this.query.trim()) {
      this.error = 'Veuillez entrer une recherche';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.results = null;

    this.apiService.askQuestion(this.query).subscribe({
      next: (data) => {
        this.results = this.formatResponse(data);
        this.lastSearches.unshift(this.query);
        if (this.lastSearches.length > 5) {
          this.lastSearches.pop();
        }
      },
      error: (err) => {
        this.error = 'Erreur lors de la recherche';
        console.error('API Error:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private formatResponse(data: any): any {
    // Formater le contenu pour améliorer l'affichage
    if (data.content) {
      data.shortContent = data.content.substring(0, 500) + '...';
      data.formattedContent = data.content
        .replace(/\n/g, '<br>')
        .replace(/===(.+?)===/g, '<h3>$1</h3>')
        .replace(/==(.+?)==/g, '<h4>$1</h4>');
    }
    return data;
  }

  retrySearch(search: string) {
    this.query = search;
    this.search();
  }
}