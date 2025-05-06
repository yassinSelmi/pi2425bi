import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {

  ngAfterViewInit() {
    // Trouver l'élément vidéo
    const video = document.getElementById('backgroundVideo') as HTMLVideoElement;
    if (video) {
      video.play().catch(error => {
        console.error('Error trying to play the video:', error);
      });
    }
  }
}
