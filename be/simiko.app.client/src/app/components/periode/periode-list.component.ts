import { Component, OnInit } from '@angular/core';
import { Periode, PeriodeService } from '../../services/cores/periode.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-periode-list',
  standalone: false,
  templateUrl: './periode-list.component.html',
  styleUrl: './periode-list.component.css'
})
export class PeriodeListComponent implements OnInit {

  periodes: Periode[] = [];
  isLoading = false;
  error: string | null = null;
  hasActivePeriode = false;

  displayedColumns: string[] = ['periode', 'startDate', 'endDate', 'aktif', 'actions'];

  constructor(
    private periodeService: PeriodeService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadPeriodes();
  }

  loadPeriodes() {
    this.isLoading = true;
    this.error = null;

    this.periodeService.getPeriodes()
      .subscribe({
        next: (data) => {
          this.periodes = data;
          // Cek apakah sudah ada periode yang aktif
          this.hasActivePeriode = this.periodes.some(periode => periode.aktif);
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Galat memuat data: ' + (err.message || 'Kesalahan tidak diketahui');
          this.isLoading = false;
        }
      });
  }

  createPeriode() {
    this.router.navigate(['/periode/create']);
  }

  editPeriode(id: number) {
    this.router.navigate(['/periode/edit', id]);
  }

  async deletePeriode(id: number) {

    // Cek terlebih dahulu apakah periode sedang aktif
    const periodeToDelete = this.periodes.find(p => p.id === id);
    if (periodeToDelete?.aktif) {
      this.snackBar.open('Periode yang sedang aktif tidak dapat dihapus. Nonaktifkan terlebih dahulu.', 'Tutup', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Konfirmasi Hapus',
        message: 'Apakah Anda yakin ingin menghapus periode ini? Akan berpengaruh pada seluruh data terkait periode ini',
        confirmText: 'Hapus',
        cancelText: 'Batal'
      }
    });

    const result = await firstValueFrom(dialogRef.afterClosed());

    if (result) {
      try {
        await firstValueFrom(this.periodeService.deletePeriode(id));
        this.snackBar.open('Periode berhasil dihapus', 'Tutup', { duration: 3000 });
        this.loadPeriodes(); // Reload the list
      } catch (error: any) {
        this.snackBar.open('Galat menghapus periode: ' + (error.message || 'Kesalahan tidak diketahui'), 'Tutup', { duration: 5000 });
      }
    }
  }

  async toggleStatusPeriode(periode: Periode) {
    try {
      if (periode.aktif) {
        // Jika periode sedang aktif, menonaktifkannya
        await firstValueFrom(this.periodeService.deactivatePeriode(periode.id!));
        this.snackBar.open('Periode berhasil dinonaktifkan', 'Tutup', { duration: 3000 });
      } else {
        // Jika sudah ada periode aktif, tidak bisa mengaktifkan periode lain
        if (this.hasActivePeriode) {
          this.snackBar.open('Sudah ada periode yang aktif. Nonaktifkan terlebih dahulu periode yang aktif.', 'Tutup', {
            duration: 5000,
            panelClass: ['warning-snackbar']
          });
          return;
        }

        // Jika tidak ada periode aktif, bisa mengaktifkan periode ini
        await firstValueFrom(this.periodeService.activatePeriode(periode.id!));
        this.snackBar.open('Periode berhasil diaktifkan', 'Tutup', { duration: 3000 });
      }

      this.loadPeriodes(); // Reload after update
    } catch (error: any) {
      this.snackBar.open('Error mengubah status periode: ' + (error.message || 'Unknown error'), 'Tutup', { duration: 5000 });
    }
  }

  // Menentukan apakah chip status harus di-disable
  isStatusChipDisabled(periode: Periode): boolean {
    if (periode.aktif) {
      // Periode yang aktif selalu enabled untuk bisa dinonaktifkan
      return false;
    } else {
      // Periode yang tidak aktif akan disabled jika sudah ada periode lain yang aktif
      return this.hasActivePeriode;
    }
  }

  // Mendapatkan tooltip untuk status chip
  getStatusTooltip(periode: Periode): string {
    if (periode.aktif) {
      return 'Klik untuk menonaktifkan periode ini';
    } else {
      return this.hasActivePeriode
        ? 'Nonaktifkan periode aktif terlebih dahulu untuk mengaktifkan periode ini'
        : 'Klik untuk mengaktifkan periode ini';
    }
  }

}
